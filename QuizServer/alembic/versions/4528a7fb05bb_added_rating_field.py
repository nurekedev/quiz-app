"""added rating field

Revision ID: 4528a7fb05bb
Revises: 9a8b984125ca
Create Date: 2025-07-27 03:28:43.787020

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4528a7fb05bb"
down_revision: Union[str, None] = "9a8b984125ca"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("options_question_id_fkey", "options", type_="foreignkey")
    op.create_foreign_key(
        None,
        "options",
        "questions",
        ["question_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.drop_constraint("questions_quiz_id_fkey", "questions", type_="foreignkey")
    op.create_foreign_key(
        None,
        "questions",
        "quizzes",
        ["quiz_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.alter_column(
        "quiz_results",
        "rating",
        existing_type=sa.DOUBLE_PRECISION(precision=53),
        nullable=True,
    )
    op.drop_constraint("quiz_results_user_id_fkey", "quiz_results", type_="foreignkey")
    op.drop_constraint("quiz_results_quiz_id_fkey", "quiz_results", type_="foreignkey")
    op.create_foreign_key(
        None,
        "quiz_results",
        "quizzes",
        ["quiz_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.create_foreign_key(
        None,
        "quiz_results",
        "users",
        ["user_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.drop_constraint("quiz_tags_tag_id_fkey", "quiz_tags", type_="foreignkey")
    op.drop_constraint("quiz_tags_quiz_id_fkey", "quiz_tags", type_="foreignkey")
    op.create_foreign_key(
        None,
        "quiz_tags",
        "quizzes",
        ["quiz_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.create_foreign_key(
        None,
        "quiz_tags",
        "tags",
        ["tag_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.drop_constraint(
        "user_achievements_achievement_id_fkey", "user_achievements", type_="foreignkey"
    )
    op.drop_constraint(
        "user_achievements_user_id_fkey", "user_achievements", type_="foreignkey"
    )
    op.create_foreign_key(
        None,
        "user_achievements",
        "achievements",
        ["achievement_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.create_foreign_key(
        None,
        "user_achievements",
        "users",
        ["user_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.drop_constraint(
        "user_answers_quiz_result_id_fkey", "user_answers", type_="foreignkey"
    )
    op.drop_constraint(
        "user_answers_question_id_fkey", "user_answers", type_="foreignkey"
    )
    op.create_foreign_key(
        None,
        "user_answers",
        "questions",
        ["question_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    op.create_foreign_key(
        None,
        "user_answers",
        "quiz_results",
        ["quiz_result_id"],
        ["id"],
        source_schema="public",
        referent_schema="public",
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "user_answers", schema="public", type_="foreignkey")
    op.drop_constraint(None, "user_answers", schema="public", type_="foreignkey")
    op.create_foreign_key(
        "user_answers_question_id_fkey",
        "user_answers",
        "questions",
        ["question_id"],
        ["id"],
    )
    op.create_foreign_key(
        "user_answers_quiz_result_id_fkey",
        "user_answers",
        "quiz_results",
        ["quiz_result_id"],
        ["id"],
    )
    op.drop_constraint(None, "user_achievements", schema="public", type_="foreignkey")
    op.drop_constraint(None, "user_achievements", schema="public", type_="foreignkey")
    op.create_foreign_key(
        "user_achievements_user_id_fkey",
        "user_achievements",
        "users",
        ["user_id"],
        ["id"],
    )
    op.create_foreign_key(
        "user_achievements_achievement_id_fkey",
        "user_achievements",
        "achievements",
        ["achievement_id"],
        ["id"],
    )
    op.drop_constraint(None, "quiz_tags", schema="public", type_="foreignkey")
    op.drop_constraint(None, "quiz_tags", schema="public", type_="foreignkey")
    op.create_foreign_key(
        "quiz_tags_quiz_id_fkey", "quiz_tags", "quizzes", ["quiz_id"], ["id"]
    )
    op.create_foreign_key(
        "quiz_tags_tag_id_fkey", "quiz_tags", "tags", ["tag_id"], ["id"]
    )
    op.drop_constraint(None, "quiz_results", schema="public", type_="foreignkey")
    op.drop_constraint(None, "quiz_results", schema="public", type_="foreignkey")
    op.create_foreign_key(
        "quiz_results_quiz_id_fkey", "quiz_results", "quizzes", ["quiz_id"], ["id"]
    )
    op.create_foreign_key(
        "quiz_results_user_id_fkey", "quiz_results", "users", ["user_id"], ["id"]
    )
    op.alter_column(
        "quiz_results",
        "rating",
        existing_type=sa.DOUBLE_PRECISION(precision=53),
        nullable=False,
    )
    op.drop_constraint(None, "questions", schema="public", type_="foreignkey")
    op.create_foreign_key(
        "questions_quiz_id_fkey", "questions", "quizzes", ["quiz_id"], ["id"]
    )
    op.drop_constraint(None, "options", schema="public", type_="foreignkey")
    op.create_foreign_key(
        "options_question_id_fkey", "options", "questions", ["question_id"], ["id"]
    )
    # ### end Alembic commands ###
